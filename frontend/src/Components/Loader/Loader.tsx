import { FC } from "react";
import { HashLoader } from "react-spinners";
import { LOADER_SETTINGS } from "../../Constants/Constants";
import { LoaderWrapper } from "../../Styles/StyledComponents";

const Loader: FC = () => {
    return (
        <LoaderWrapper>
            <HashLoader {...LOADER_SETTINGS} />
        </LoaderWrapper>
    );
};

export default Loader;