import React from 'react';
import {
  Card,
  Flex,
  Spinner,
  Heading,
  Button
} from "@contentful/f36-components";
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { AppInstallationParameters } from './ConfigScreen';
import { css } from '@emotion/css'

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  const {
    apiKey,
    componentsLibraryKey
  } = props.sdk.parameters.installation as AppInstallationParameters;
  const [figmaComponents, setFigmaComponents] = React.useState([]);
  const [figmaErrorMessage, setFigmaErrorMessage] = React.useState('');
  // @ts-ignore
  const selectedFigmaComponentKey = props.sdk.parameters.invocation.figmaComponentKey
  console.log('PARAMETER --->', apiKey, componentsLibraryKey);
  

  const [selectedCard, setSelectedCard] = React.useState("");
  const handleSelectCard = (event: any) => {
    const componentId = (event.target.tagName === 'IMG') ? event.target.closest('article').id: event.target.id;
   
    if (selectedCard === componentId) {
      setSelectedCard("");
    } else {
      setSelectedCard(componentId);
    }
  };

  React.useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    (async () => {
      const result = await getFigmaComponents();
      console.log('RESULT --->', result);
      setSelectedCard(selectedFigmaComponentKey || '');
    })();
  }, [])

  const getFigmaComponents = async () => {
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
    if (results && results.error && results.message) {
      setFigmaErrorMessage(results.message);
    }
    if (results && results.meta && results.meta.components) {
      setFigmaComponents(results.meta.components);
    }
  };

  const handleCloseDialog = () => {
    props.sdk.close({
      value: selectedCard
    });
  };

  return (
    <div
    className={css`
      padding-left: 10px;
    `}
    >
      {figmaErrorMessage.length?<Heading className={css`
            color: #DA294A;
          `}> FIGMA ERROR - {figmaErrorMessage} !</Heading>: ""}
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
              {(selectedCard !== "") && figmaComponents.length &&
              <div>
                <Heading> 
                  {/* 
                  // @ts-ignore */}
                {figmaComponents.find(({ key }) => (key === selectedCard)).name} component is selected
                </Heading>
                <Button onClick={handleCloseDialog} isDisabled={selectedCard === ""} variant="primary">
                  confirm selection
                </Button>
              </div>
              }
            </div>
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              className={css`
              top: 100px;
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
                    isSelected={selectedCard === key}
                    className={css`
                        max-width: 200px;
                        margin-bottom: 10px;
                      `}
                  >
                    <img 
                      src={thumbnail_url} 
                      alt={name} 
                      className={css`
                        max-width: 100%;
                      `} 
                    />
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
