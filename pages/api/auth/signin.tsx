function SignIn(props) {
    return (
        <div className="sign-in-form">
            <form>                
                <h1>Login</h1>
                <input type="email" placeholder="john@email.com"/>
                <input type="password" placeholder="********"/>
                <input type="submit" value="Login"/>
            </form>
        </div>
    );
}

export default SignIn;
