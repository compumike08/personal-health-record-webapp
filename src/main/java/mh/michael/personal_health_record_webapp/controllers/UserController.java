package mh.michael.personal_health_record_webapp.controllers;

import mh.michael.personal_health_record_webapp.dto.UserDTO;
import mh.michael.personal_health_record_webapp.security.JwtUserDetails;
import mh.michael.personal_health_record_webapp.services.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/currentUser")
    public UserDTO getCurrentUser(@AuthenticationPrincipal JwtUserDetails jwtUserDetails) {
        return userService.getCurrentUser(jwtUserDetails);
    }

    @PostMapping("/currentUser/editUser")
    public UserDTO changeUsername(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody UserDTO requestDTO
    ) {
        return userService.editUser(requestDTO, jwtUserDetails);
    }
}
