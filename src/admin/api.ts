/* global $: false */
/// <reference path="../../.types/jquery/jquery.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />


import model = require('../shorties/model');
import _ = require('underscore');

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
  private static sendRequest<TData>(request: ApiRequest, callback: (response: ApiResponse<TData>) => void): void {
    $.ajax({
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json'
      },
      timeout: 60 * 1000,
      url: buildUrl(request.path),
      type: request.verb,
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
          error: jqXHR.responseText
        });
      }
    });
  }

  public getShorties(callback: (response: ApiResponse<Array<model.Shortie>>) => void): void {
    ApiClient.sendRequest<Array<model.Shortie>>({
      path: '/api/shorties/',
      verb: 'GET'
    }, callback);
  }

  public getShortie(slug: string, callback: (response: ApiResponse<model.Shortie>) => void): void {
    ApiClient.sendRequest<model.Shortie>({ 
      path: '/api/shorties/' + slug,
      data: {
        noRedirect: true
      },
      verb: 'GET'
    }, callback);
  }

  public deleteShortie(slug: string, callback: (response: ApiResponse<any>) => void) {
    ApiClient.sendRequest({
      path: '/api/shorties/' + slug,
      verb: 'DELETE'
    }, callback);
  }

  public saveShortie(slug: string, shortie: model.Shortie, callback: (response: ApiResponse<any>) => void): void {
    var saveRequest = {
      path: '/api/shorties/' + slug,
      verb: 'PUT',
      data: JSON.stringify(shortie)
    };
    ApiClient.sendRequest(saveRequest, callback);
  }

  public saveNewShortie(url: string, callback: (response: ApiResponse<model.Shortie>) => void): void {
    ApiClient.sendRequest<model.Shortie>({
        path: '/api/shorties/',
        verb: 'POST',
        data: JSON.stringify({ url: url })
      }, callback);
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
