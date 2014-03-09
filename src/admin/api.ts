/// <reference path="../../.types/jquery/jquery.d.ts" />

import shortieModel = require('../shorties/model');
import $ = require('jquery');

export interface ApiRequest {
  path: string;
  verb: string;
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
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json'
      },
      timeout: 60 * 1000,
      url: buildUrl(request.path),
      type: request.verb,
      data: JSON.stringify(request.data),
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

function tryParseJSON<T>(data: string, callback: (obj: T, success: boolean) => void) {
  try {
    var obj = JSON.parse(data);
    callback(obj, true);
  }
  catch (e) {
    callback(null, false);
  }
}


function buildUrl(path: string): string {
  return '' + path;
}