export const obtainQueryParamFromUrl = (url, paramName) => {
    const urlParams = new URLSearchParams(url.split('?')[1])
    const param = urlParams.get(paramName)
    return param
}