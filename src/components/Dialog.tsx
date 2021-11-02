import React from 'react';
import { Button, Card, Typography, Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  const handleCloseDialog = () => {
    props.sdk.close({
      value: 'Anil Kumar'
    });
  };

  return (
    <div>
      <Card title="Title">
        <Typography>
          <Paragraph>This is the Card’s content</Paragraph>
        </Typography>
      </Card>
      <Button onClick={handleCloseDialog}>
            Close the dialog app
          </Button>
    </div>
    
  );
};

export default Dialog;
