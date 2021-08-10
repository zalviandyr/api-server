export default class ResponseMessage {
  static notFound = 'Maaf, tidak ada hasil untuk mu';

  static queryRequired = (
    queries: Array<string>,
    examples: Array<string> = [],
  ): string => {
    const msg = 'Silahkan isi query ';
    let result = msg + queries.join(', ');

    if (examples.length === 0) {
      return result;
    }

    const exampleQuery = examples
      .map((val, index) => {
        if (index === 0) {
          return `?${queries[index]}=${val}`;
        }
        return `${queries[index]}=${val}`;
      })
      .join('&');

    result = `${result}. Contoh ${exampleQuery}`;
    return result;
  };
}
