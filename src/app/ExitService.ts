export interface ExitService {
    leave(): void;
}

export class NavigationExitService implements ExitService {
    public constructor(
        private readonly url: string,
        private readonly location: Location = window.location,
    ) { }

    public leave(): void {
        this.location.replace(this.url);
    }
}
