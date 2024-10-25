/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

import { UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { uniqueId } from "lodash";
import { EformType } from "../../../../../types/api";
import { arrayBufferToDataURL } from "../../../../../utils/files/arrayBufferToDataURL";
declare global {
  interface Window {
    AdobeDC: {
      View: {
        new (config: { clientId: string; divId?: string }): {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          previewFile: (content: any, viewerConfig?: any) => Promise<any>;
          registerCallback: (
            callbackType: string,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            callback: Function,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options?: any
          ) => void;
        };
        Enum: {
          CallbackType: {
            SAVE_API: string;
          };
          ApiResponseCode: {
            SUCCESS: string;
          };
        };
      };
    };
  }
}

class ViewSDKClient {
  //Properties
  patientId: number;
  userId: number;
  date: number;
  originalEform: EformType | null;
  method: "post" | "put";
  fileName: string;
  careElementMutation:
    | UseMutationResult<EformType, Error, Partial<EformType>, void>
    | UseMutationResult<EformType, Error, EformType, void>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  readyPromise: Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adobeDCView: any;

  constructor(
    patientId: number,
    userId: number,
    date: number,
    originalEform: EformType | null,
    method: "post" | "put",
    fileName: string,
    careElementMutation:
      | UseMutationResult<EformType, Error, Partial<EformType>, void>
      | UseMutationResult<EformType, Error, EformType, void>,
    setAddVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.patientId = patientId;
    this.userId = userId;
    this.date = date;
    this.originalEform = originalEform;
    this.method = method;
    this.fileName = fileName;
    this.careElementMutation = careElementMutation;
    this.setAddVisible = setAddVisible;
    this.readyPromise = new Promise((resolve) => {
      if (window.AdobeDC) {
        resolve(true);
      } else {
        /* Wait for Adobe Acrobat Services PDF Embed API to be ready */
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
          resolve(true);
        });
      }
    });
    this.adobeDCView = undefined;
  }

  ready() {
    return this.readyPromise;
  }

  previewFile(
    divId: string,
    viewerConfig: Record<string, unknown>,
    url: string
  ) {
    const config: { clientId: string; divId?: string } = {
      /* Pass your registered client id */
      clientId:
        import.meta.env.MODE === "development"
          ? import.meta.env.VITE_PDF_EMBED_API_CLIENT_ID_DEV
          : import.meta.env.VITE_PDF_EMBED_API_CLIENT_ID,
    };
    if (divId) {
      /* Optional only for Light Box embed mode */
      /* Pass the div id in which PDF should be rendered */
      config.divId = divId;
    }
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View(config);

    /* Invoke the file preview API on Adobe DC View object */
    const previewFilePromise = this.adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          /* Location of file where it is hosted */
          location: {
            url,
            /*
                  If the file URL requires some additional headers, then it can be passed as follows:-
                  headers: [
                      {
                          key: "<HEADER_KEY>",
                          value: "<HEADER_VALUE>",
                      }
                  ]
                  */
          },
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: this.fileName,
          /* file ID */
          id: uniqueId(),
        },
      },
      viewerConfig
    );

    return previewFilePromise;
  }

  previewFileUsingFilePromise(
    divId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filePromise: Promise<any>,
    fileName: string
  ) {
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View({
      /* Pass your registered client id */
      clientId: "519f1d11ccb9494f92423256aa86d47d", //dev
      // clientId: "152a928452264688b86a1aa460f3993c", //prod

      /* Pass the div id in which PDF should be rendered */
      divId,
    });

    /* Invoke the file preview API on Adobe DC View object */
    this.adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          /* pass file promise which resolve to arrayBuffer */
          promise: filePromise,
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: fileName,
        },
      },
      {}
    );
  }
  registerSaveHandler() {
    const saveOptions = {
      autoSaveFrequency: 0,
      enableFocusPolling: false,
      showSaveButton: true,
    };
    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.SAVE_API,
      async (metaData: Record<string, unknown>, content: Iterable<number>) => {
        const dataURL = arrayBufferToDataURL(content, "application/pdf");
        const attachmentFile = (
          await axios.post(import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT, {
            content: dataURL,
          })
        ).data;

        if (this.method === "post") {
          const eformToPost: Partial<EformType> = {
            date_created: this.date,
            created_by_id: this.userId,
            name: this.fileName,
            file: attachmentFile,
            patient_id: this.patientId,
          };
          (
            this.careElementMutation as UseMutationResult<
              EformType,
              Error,
              Partial<EformType>,
              void
            >
          ).mutate(eformToPost, {
            onSuccess: () => {
              this.setAddVisible(false);
            },
          });
        } else {
          const eformToPut: EformType = {
            ...(this.originalEform as EformType),
            file: attachmentFile,
            updates: [
              ...(this.originalEform as EformType).updates,
              { date_updated: this.date, updated_by_id: this.userId },
            ],
          };
          (
            this.careElementMutation as UseMutationResult<
              EformType,
              Error,
              EformType,
              void
            >
          ).mutate(eformToPut, {
            onSuccess: () => {
              this.setAddVisible(false);
            },
          });
        }
        return new Promise((resolve) => {
          resolve({
            code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
          });
        });
      },
      saveOptions
    );
  }
}

export default ViewSDKClient;
