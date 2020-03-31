export class FrontEndConfig {
    constructor() { }
    serverurl = 'http://localhost:4000';
    frontendurl = 'http://localhost:4200';
    getserverurl() {
      return this.serverurl;
    }
    getfrontendurl() {
      return this.frontendurl;
    }
  }
