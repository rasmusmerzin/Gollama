import "./style.css";
import "material-icons/iconfont/material-icons.css";
import { AppElement } from "./AppElement";

const app = AppElement.get();
app.render();
document.body.append(app);
