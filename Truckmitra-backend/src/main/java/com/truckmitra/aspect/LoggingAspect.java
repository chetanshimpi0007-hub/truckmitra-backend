package com.truckmitra.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("within(com.truckmitra.controller..*) || within(com.truckmitra.service..*)")
    public Object logControllerAndService(ProceedingJoinPoint pjp) throws Throwable {
        String className = pjp.getSignature().getDeclaringTypeName();
        String methodName = pjp.getSignature().getName();
        Object[] args = pjp.getArgs();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String principal = auth != null ? String.valueOf(auth.getPrincipal()) : "anonymous";
        String authorities = auth != null && auth.getAuthorities() != null ? auth.getAuthorities().toString() : "[]";

        try {
            log.info("ENTER {}#{} args={} principal={} authorities={}", className, methodName, Arrays.toString(safeToString(args)), principal, authorities);
            Object result = pjp.proceed();
            log.info("EXIT {}#{} resultType={}", className, methodName, result != null ? result.getClass().getSimpleName() : "null");
            return result;
        } catch (Throwable t) {
            log.error("ERROR {}#{} args={} principal={} authorities={} -> {}", className, methodName, Arrays.toString(safeToString(args)), principal, authorities, t.toString());
            log.error("Stacktrace:", t);
            throw t;
        }
    }

    private Object[] safeToString(Object[] args) {
        if (args == null) return new Object[]{};
        Object[] out = new Object[args.length];
        for (int i = 0; i < args.length; i++) {
            try {
                out[i] = args[i] == null ? "null" : args[i].toString();
            } catch (Throwable e) {
                out[i] = "[toString-error:" + e.getClass().getSimpleName() + "]";
            }
        }
        return out;
    }
}
