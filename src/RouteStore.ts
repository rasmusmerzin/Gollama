export type Route = "new-chat" | "chat" | "error";

export class RouteStore extends EventTarget {
  static instance: RouteStore | null = null;
  static get() {
    if (!this.instance) this.instance = new RouteStore();
    return this.instance;
  }

  route: Route = "new-chat";
  detail: string | null = null;

  constructor() {
    super();
    this.load();
    if (this.route === "error") this.set("new-chat");
  }

  get chat_id(): string | null {
    return this.route === "chat" ? this.detail : null;
  }
  get error(): string | null {
    return this.route === "error" ? this.detail : null;
  }

  set(route: Route, id?: string) {
    this.route = route;
    this.detail = id || null;
    this.touch();
  }

  touch() {
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  load() {
    const data = localStorage.getItem("route");
    if (!data) return;
    try {
      Object.assign(this, JSON.parse(data));
    } catch (error) {
      console.error(error);
    }
  }

  save() {
    localStorage.setItem("route", JSON.stringify(this));
  }
}
