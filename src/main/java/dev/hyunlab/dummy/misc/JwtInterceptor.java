package dev.hyunlab.dummy.misc;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import dev.hyunlab.gravity.cmmn.misc.GcJwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtInterceptor implements HandlerInterceptor {
@Value("${app.check.jwt}")
private Boolean checkJwt;

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
    throws Exception {

  if (!checkJwt) {
    return true;
  }

  if (request.getMethod().equals("OPTIONS")) {
    return true;
  }

  String authentication = request.getHeader("Authentication");

  if (Utils.isEmpty(authentication)) {
    log.error("{}", "E_JWT_01 Authentication NOT EXISTS");
    log.error("\t{}\t{}\t{}\t{}", Utils.getIp(request), request.getMethod(), request.getRequestURI(),
        request.getQueryString());

    throw new RuntimeException("");
  }

  if (!authentication.startsWith("Bearer ")) {
    log.error("{} {}", "E_JWT;BEARER_NOT_EXISTS", authentication);
    log.error("\t{}\t{}\t{}\t{}", Utils.getIp(request), request.getMethod(), request.getRequestURI(),
        request.getQueryString());

    throw new RuntimeException("");
  }

  String token = authentication.replaceAll("Bearer ", "");

  if (!GcJwtUtils.validateToken(token)) {
    log.error("{} {}", "E_JWT;INVALID_TOKEN", token);
    log.error("\t{}\t{}\t{}\t{}", Utils.getIp(request), request.getMethod(), request.getRequestURI(),
        request.getQueryString());

    throw new RuntimeException("");
  }

  request.setAttribute("token", token);
  request.setAttribute(Const.KEY_BODY_MAP, GcJwtUtils.getBody(token));

  return true;
}
}