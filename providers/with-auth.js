import fetch from 'isomorphic-fetch';
import Router from 'next/router';

export default function withAuth(Component) {
    const originalGetInitialProps = Component.getInitialProps;

    Component.getInitialProps = async function(input) {
        let props;
        
        if (originalGetInitialProps) {
            props = await originalGetInitialProps(props);
        }
        
        const { req, res } = input;
        // TODO: for first auth request it doesnt work (only set-cookie header available)
        const cookies = req.headers.cookie;
        const meResp = await fetch('http://localhost:3000/me', { headers: { cookie: cookies } });
        if (meResp.status === 401) {
            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        }
        const data = await meResp.json();
        return {
            ...props,
            ...data
        }
    }

    return Component;
}