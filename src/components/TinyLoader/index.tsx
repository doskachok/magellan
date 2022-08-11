import { TinyLoaderStyled } from "./index.styled";

interface Props {
  isLoading: boolean;
}

const TinyLoader = ({ isLoading }: Props) => {
  if (isLoading)
    return (
      <TinyLoaderStyled>
        <div className="loader-line"></div>
      </TinyLoaderStyled>
    );
  return null;
};

export default TinyLoader;
