import {environment} from '../../environments/environment';


export class Constants {
  /**
   * Define base url for api endpoints
   */
  public static readonly BASE_URL = environment.apiUrl + environment.apiVersion;

  /**
   *  Define endpoints here for auth APIs
   */
  public static readonly createNewstore = Constants.BASE_URL + '/api/shop';

  public static readonly storestoresDetail = Constants.BASE_URL + '/api/shop/search';


}
