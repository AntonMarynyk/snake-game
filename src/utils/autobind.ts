function autobind(this: any): void {
    let proto = Object.getPrototypeOf(this);
    const bindedProps: string[] = [];

    Object.getOwnPropertyNames(proto).forEach((prop) => {
        const isConstructor = prop === "constructor";
        const isFunction = typeof this[prop] === "function";

        if (!isConstructor && isFunction) {
            this[prop] = this[prop].bind(this);
            bindedProps.push(prop);
        }
    });
    while (proto !== null) {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
            const isConstructor = prop === "constructor";
            const isFunction = typeof this[prop] === "function";
            const inInMainClass = bindedProps.includes(prop);

            if (!isConstructor && isFunction && !inInMainClass) {
                this[prop] = proto[prop].bind(this);
                bindedProps.push(prop);
            }
        });
        proto = Object.getPrototypeOf(proto);
    }
}


export function Autobind<T extends { new(...args: any[]): any }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            autobind.apply(this);
        }
    };
}
