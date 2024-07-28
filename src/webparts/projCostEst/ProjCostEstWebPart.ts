import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProjCostEstWebPartStrings';
import ProjCostEst from './components/ProjCostEst';
import { IProjCostEstProps } from './components/IProjCostEstProps';
import { sp } from "@pnp/sp";

export interface IProjCostEstWebPartProps {
  description: string;
  listName: string; // Add this line
}

export default class ProjCostEstWebPart extends BaseClientSideWebPart<IProjCostEstWebPartProps> {


  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<IProjCostEstProps > = React.createElement(
      ProjCostEst,
      {
        description: this.properties.description,
        listName: this.properties.listName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listName', {
                  label: 'List Name' // Add this field
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
