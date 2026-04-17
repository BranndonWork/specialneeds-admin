import {useTranslations} from 'next-intl';
import Form from "../Search/Form";
import { serveAsset } from "@utils/assetHelpers";
import Image from "next/image";

const SearchArea = () => {
  const tCommon = useTranslations('common');
  const tDescriptions = useTranslations('descriptions');

  return (
    <>
      <section className="banner-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="homepage-banner-image">
                <Image
                  src={serveAsset("logoTreeTransparent")}
                  alt="SpecialNeeds.com logo: A tree with multicolored leaves symbolizing unity in diversity."
                  width={400}
                  height={360}
                />
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <Form
                formTitle={tCommon('terms.directory')}
                formSubTitle={tDescriptions('directorySearchArea')}
                showLocation={true}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default SearchArea;
