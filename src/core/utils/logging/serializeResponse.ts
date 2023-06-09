import statuses from '@bundled-es-modules/statuses'
import { HeadersObject, headersToObject } from 'headers-polyfill'

const { message } = statuses

export interface SerializedResponse {
  status: number
  statusText: string
  headers: HeadersObject
  body: string
}

export async function serializeResponse(
  response: Response,
): Promise<SerializedResponse> {
  const responseClone = response.clone()
  const responseText = await responseClone.text()

  // Normalize the response status and status text when logging
  // since the default Response instance doesn't infer status texts
  // from status codes. This has no effect on the actual response instance.
  const responseStatus = responseClone.status || 200
  const responseStatusText =
    responseClone.statusText || message[responseStatus] || 'OK'

  return {
    status: responseStatus,
    statusText: responseStatusText,
    headers: headersToObject(responseClone.headers),
    body: responseText,
  }
}
