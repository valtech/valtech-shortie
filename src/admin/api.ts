/// <reference path="../../.types/jquery/jquery.d.ts" />

import shortieModel = require('../shorties/model');
import $ = require('jquery');

export enum HttpVerb {
  GET,
  POST
}

export interface ApiRequest {
  path: string;
  verb: HttpVerb;
  data?: any;
}

export interface ApiResponse<TData> {
  status: number;
  error?: string;
  data?: TData;
}

export class ApiClient {
  public sendRequest<TData>(request: ApiRequest, callback: (response: ApiResponse<TData>) => void): void {
    $.ajax({
      accepts: 'application/json',
      contentType: 'application/json',
      timeout: 60 * 1000,
      url: buildUrl(request.path),
      type: request.verb.toString(),
      data: request.data,
      success: (data, textStatus, jqXHR) => {
        callback({
          status: jqXHR.status,
          data: data
        });
      },
      error: (jqXHR, textStatus, errorThrow) => {
        callback({
          status: jqXHR.status,
          data: jqXHR.response
        });
      }
    });
  }
}

function buildUrl(path: string): string {
  return '/shorties' + path;
}