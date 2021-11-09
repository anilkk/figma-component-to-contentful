import React, { useCallback, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Workbench } from '@contentful/forma-36-react-components';
import {
  Form,
  Flex,
  Heading,
  FormControl,
  TextInput
} from "@contentful/f36-components";
import { css } from 'emotion';

export interface AppInstallationParameters {
  apiKey?:string;
  componentsLibraryKey?:string;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

const Config = ({ sdk }: ConfigProps) => {
  const [parameters, setParameters] = React.useState<AppInstallationParameters>(
    { apiKey: '', componentsLibraryKey: '' }
  );
  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk?.app.getCurrentState()

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    }
  }, [parameters, sdk])

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk?.app.onConfigure(() => onConfigure())
  }, [sdk, onConfigure])

  useEffect(() => {
    ;(async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        (await sdk?.app.getParameters()) || null

      if (currentParameters) {
        setParameters(currentParameters)
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk?.app.setReady()
    })()
  }, [sdk])
  
  function updateApiKey(event: React.ChangeEvent<HTMLInputElement>) {
    setParameters((prevParams) => ({
      ...prevParams,
      apiKey: event.target.value.trim(),
    }))
  }

  function updateComponentsLibraryKey(event: React.ChangeEvent<HTMLInputElement>) {
    setParameters((prevParams) => ({
      ...prevParams,
      componentsLibraryKey: event.target.value.trim(),
    }))
  }

  return (
    <Workbench>
      <Flex
        alignItems="center"
        flexDirection={"row"}
        flexWrap="wrap"
        justifyContent="center"
        margin="spacing4Xl"
      >
        <Form>
          <div>
            <Heading  className={css`
              margin-bottom:20px;
            `}
          >Connect to your Figma</Heading>
          <FormControl isRequired>
            <FormControl.Label>FIGMA ACCESS TOKEN:</FormControl.Label>
            <TextInput id="apiKey"
              name="apiKey"
              value={parameters.apiKey}
              onChange={updateApiKey}/>
            <FormControl.HelpText>
              More details on {" "}
              <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer"> 
                Figma access token
              </a>.
            </FormControl.HelpText>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>FIGMA TEAM ID:</FormControl.Label>
            <TextInput
              id="componentsLibraryKey"
              name="componentsLibraryKey"
              value={parameters.componentsLibraryKey}
              onChange={updateComponentsLibraryKey}
              className={css`
                margin-bottom:20px;
              `}
            />
            <FormControl.HelpText>
            You can find your <strong>Figma team id</strong> on the URL by selecting your team on Figma as shown below.
            </FormControl.HelpText>
          </FormControl>
            <img src="../img/figma-team-id.png" alt="Figma team id" className={css`
            max-width:600px;
          `} />
          </div>
        </Form>
      </Flex>
    </Workbench>
  )
};

export default Config;