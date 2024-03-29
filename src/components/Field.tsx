import React, { useEffect, useState} from 'react';
import {
  Asset,
  Button,
  TextInput
} from "@contentful/f36-components";
import { FieldExtensionSDK } from '@contentful/app-sdk';
// import "@contentful/forma-36-fcss/dist/styles.css";
import { AppInstallationParameters } from './ConfigScreen';
import { css } from '@emotion/css'

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FigmaComponent {
  meta: {
    name: string;
    thumbnail_url: string;
  }
}

const Field = (props: FieldProps) => {
  const {
    apiKey,
  } = props.sdk.parameters.installation as AppInstallationParameters;
  const [value, setValue] = useState('');
  const [component, setComponent] = useState(null);
  React.useEffect(() => {
    const result = props.sdk.field.getValue();
    setValue(result);
  }, []);
  
  const handleOpenDialog = async () => {
    const { sdk } = props;
    await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'Choose Figma component',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: {
        figmaComponentKey: value
       },
      width: 600,
      minHeight: 400,
      allowHeightOverflow: true
    })
    .then(async (result) => {
      if(result && result.value) {
        await sdk.field.setValue(result.value);
        setValue(result.value);
      }
    })
    .catch(error => {
      console.error('ERROR --->', error);
    });
  };

  useEffect(() => {
    (async () => {

      if (value) {
        const figmaComponent:FigmaComponent = await fetch(`https://api.figma.com/v1/components/${value}`, {
          // @ts-ignore
          headers: {
            'X-FIGMA-TOKEN': apiKey
          }
        })
        .then(res => res.json());
        setComponent({
          // @ts-ignore
          name: figmaComponent.meta.name,
          thumbnailUrl: figmaComponent.meta.thumbnail_url,
        });
        props.sdk.window.startAutoResizer();
      }
    })();
  }, [value]);

  return (
    <div>
      <TextInput
        id="text-input"
        name="text-input"
        isDisabled={true}
        value={value}
      />
       <Button
        variant="secondary"
        onClick={handleOpenDialog}
        className="f36-margin-top--l f36-margin-bottom--l"
       >
          {value? 'Select a different Figma component': 'Select a Figma component'}
        </Button>
        {component && <Asset 
          className={css`
          max-width: 100%;
        `}
          // @ts-ignore
          src={component.thumbnailUrl}
        />}
    </div>
  );
};

export default Field;
