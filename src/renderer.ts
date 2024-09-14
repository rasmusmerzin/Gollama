import "./style.css";
import { AppElement } from "./AppElement";

const app = AppElement.get();
app.render();
document.body.append(app);
