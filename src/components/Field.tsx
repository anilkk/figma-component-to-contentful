import React from 'react';
import { Paragraph, Button, TextInput } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  
  const handleOpenDialog = async () => {
    const { sdk } = props;
    const result = await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'Choose Figma component',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: { },
      width: 400,
      allowHeightOverflow: true
    })
    .then(result => {
      console.log('RESULT -->', result);
    });
  };
  return (
    <div>
      <TextInput
        id="text-input"
        labelText="text-input-label-text"
        name="text-input"
      />
       <Button buttonType="muted"
        icon="Tab"
        onClick={handleOpenDialog}
       >
          Select the Figma component
        </Button>
      <Paragraph>Hello Entry Field Component</Paragraph>
    </div>
  );
};

export default Field;
