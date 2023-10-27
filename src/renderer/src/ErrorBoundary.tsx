

import { Component } from "react";

class ErrorBoundary extends Component {
    state = {hasError: false}

    // @ts-ignore
    static getDerivedStateFromError(error){
        return {hasError: true}
    }

    // @ts-ignore
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // @ts-ignore
        console.log(error, errorInfo);
      }

    render(){
        if(this.state.hasError)
        return(<div>something went wrong</div>)

        // @ts-ignore
        return this.props.children
    }
}

export default ErrorBoundary;