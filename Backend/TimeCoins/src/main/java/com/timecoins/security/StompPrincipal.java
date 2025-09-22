package com.timecoins.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@AllArgsConstructor
@Getter
public class StompPrincipal implements Principal {
    private final String name;
}
