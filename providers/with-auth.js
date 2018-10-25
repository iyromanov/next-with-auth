import fetch from 'isomorphic-fetch';
import Router from 'next/router';

export default function withAuth(Component) {
    const originalGetInitialProps = Component.getInitialProps;

    Component.getInitialProps = async function(input) {
        let props = {};
        
        if (originalGetInitialProps) {
            props = await originalGetInitialProps(props);
        }
        
        const { req, res } = input;

        if (req) {
            if (req.user) {
                return {
                    ...props,
                    ...req.user
                };
            } else {
                res.writeHead(302, { Location: '/' });
                res.end();
            }
        }

        const meResp = await fetch('http://localhost:3000/me');

        if (meResp.status === 401) {
            Router.push('/');
            return props;
        }

        const data = await meResp.json();
        return {
            ...props,
            ...data
        };
    }

    return Component;
}