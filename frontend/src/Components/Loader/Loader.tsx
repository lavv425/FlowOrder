import { FC } from "react";
import { HashLoader } from "react-spinners";
import { LOADER_SETTINGS } from "../../Constants/Constants";

const Loader: FC = () => <HashLoader {...LOADER_SETTINGS} />;

export default Loader;