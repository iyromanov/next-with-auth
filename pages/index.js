import { Fragment } from 'react';
import Link from 'next/link';

export default () => (
    <div className="root">
        <form className="form" action="/auth" method="POST">
            <div>
                <label htmlFor="login">Login:</label>
                <input id="login" name="login"/>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" />
            </div>
            <div>
                <button type="sumbit">Submit</button>
            </div>
            <Link href="/user">To User page</Link>
        </form>
        <style jsx global>{`
            html, body, #__next {
                height: 100%;
            }
            body {
                margin: 0;
            }
        `}</style>
        <style jsx>{`
            .root, .form {
                height: 100%;
            }
            .form {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            .form > div {
            }
        `}</style>
    </div>
);