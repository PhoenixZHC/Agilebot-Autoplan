from fastapi.responses import JSONResponse


def api_error(code, status_code=400, extra=None, **params):
    body = {'error_code': code}
    if params:
        body['params'] = params
    if extra:
        body.update(extra)
    return JSONResponse(body, status_code=status_code)


def api_success(code, status_code=200, extra=None, **params):
    body = {'message_code': code}
    if params:
        body['params'] = params
    if extra:
        body.update(extra)
    return JSONResponse(body, status_code=status_code)
