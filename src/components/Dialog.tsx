import React from 'react';
import { Button, Typography, Paragraph, Asset } from '@contentful/forma-36-react-components';
import {
  Card,
  Flex,
  Spinner,
  Heading
} from "@contentful/f36-components";
import "@contentful/forma-36-fcss/dist/styles.css";
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { AppInstallationParameters } from './ConfigScreen';
import { css, cx } from '@emotion/css'

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  const {
    apiKey,
    componentsLibraryKey
  } = props.sdk.parameters.installation as AppInstallationParameters;
  const [figmaComponents, setFigmaComponents] = React.useState([]);
  console.log('PARAMETER --->', apiKey, componentsLibraryKey);

  const [selectedCard, setSelectedCard] = React.useState("");
  const handleSelectCard = (event: any) => {
    const componentId = (event.target.tagName === 'IMG') ? event.target.parentElement.id: event.target.id;
   
    if (selectedCard === componentId) {
      setSelectedCard("");
    } else {
      setSelectedCard(componentId);
    }
  };

  const handleSelectCardImageClick = (event: any) => {
    // if (selectedCard === event.target.parentElement.id) {
    //   setSelectedCard("");
    // }
    // setSelectedCard(event.target.parentElement.id);
  };

  React.useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    (async () => {
      const result = await getFigmaComponents();
      console.log('RESULT --->', result);

    })();
  }, [])

  const getFigmaComponents = async () => {
    // const results: any = await fetch('https://api.figma.com/v1/teams/1026835530223828738/components', { // Forma 36 Figma Contentful
    const results: any = await fetch(`https://api.figma.com/v1/teams/${componentsLibraryKey}/components`, { // Figma to Contentful
      // @ts-ignore
      headers: {
        // 'X-FIGMA-TOKEN': '230872-6c25b679-d637-45ec-877f-848a83c53975'
        // @ts-ignore
        'X-FIGMA-TOKEN': apiKey
      }
    })
      .then(res => res.json())
      .catch((error) => {
        console.log('ERROR --->', error);
      });
    // console.log('results ---->', results.meta.components);
    setFigmaComponents(results.meta.components);
  };

  const handleCloseDialog = () => {
    props.sdk.close({
      value: selectedCard
    });
  };

  return (
    <div>
      {(figmaComponents.length) ?
        (
          <div
            className={css`
          position: relative;
        `}
          >
            <div
              className={css`
            position: fixed;
            top: 0;
            background: #fff;
            z-index: 100;
            width: 100%;
            padding: 5px;
          `}
            >
              {(selectedCard !== "") && <Heading> {
                figmaComponents.length && figmaComponents.find(({ key }) => (key === selectedCard)).name
              } component is selected</Heading>}
              {(selectedCard !== "") &&<Button onClick={handleCloseDialog} disabled={selectedCard === ""}>
                confirm selection
              </Button>}
            </div>
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              className={css`
              top: 75px;
              position: relative;
              margin: 20px;
            `}
            >
              {figmaComponents.length &&
                // @ts-ignore
                figmaComponents.map(({ thumbnail_url, name, key }, index) => (
                  <Card
                    key={`index-${index}`}
                    // className="f36-margin-bottom--l" 
                    // @ts-ignore
                    id={key}
                    onClick={handleSelectCard}
                    selected={selectedCard === key}
                    className={css`
                        max-width: 200px;
                        margin-bottom: 10px;
                      `}
                  >
                    <img 
                      src={thumbnail_url} 
                      alt={name} 
                      onClick={handleSelectCardImageClick}
                    className={css`
                      max-width: 100%;
                    `} />
                    {/* <Asset
                      src={thumbnail_url}
                      title={name}
                      type="image"
                      onClick={() => {alert('you clicked on the asset')}}
                    /> */}
                  </Card>
                ))}
            </Flex>
          </div>
        )
        : <Spinner />}

    </div>

  );
};

export default Dialog;
