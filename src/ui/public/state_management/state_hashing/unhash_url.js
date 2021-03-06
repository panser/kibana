import {
  parse as parseUrl,
  format as formatUrl,
} from 'url';

import unhashQueryString from './unhash_query_string';

export default function unhashUrl(urlWithHashes, states) {
  if (!urlWithHashes) return urlWithHashes;

  const urlWithHashesParsed = parseUrl(urlWithHashes, true);
  if (!urlWithHashesParsed.hostname) {
    // passing a url like "localhost:5601" or "/app/kibana" should be prevented
    throw new TypeError(
      'Only absolute urls should be passed to `unhashUrl()`. ' +
      'Unable to detect url hostname.'
    );
  }

  if (!urlWithHashesParsed.hash) return urlWithHashes;

  const appUrl = urlWithHashesParsed.hash.slice(1); // trim the #
  if (!appUrl) return urlWithHashes;

  const appUrlParsed = parseUrl(urlWithHashesParsed.hash.slice(1), true);
  if (!appUrlParsed.query) return urlWithHashes;

  const appQueryWithoutHashes = unhashQueryString(appUrlParsed.query || {}, states);
  return formatUrl({
    ...urlWithHashesParsed,
    hash: formatUrl({
      pathname: appUrlParsed.pathname,
      query: appQueryWithoutHashes,
    })
  });
}
