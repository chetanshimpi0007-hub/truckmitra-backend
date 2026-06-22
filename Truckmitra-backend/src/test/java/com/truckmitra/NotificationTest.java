package com.truckmitra;

import com.truckmitra.entity.Notification;
import com.truckmitra.entity.user.User;
import com.truckmitra.enums.NotificationType;
import com.truckmitra.repository.NotificationRepository;
import com.truckmitra.repository.auth.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class NotificationTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveNotification() {
        User user = userRepository.findById(1L).orElse(null);
        if (user == null) {
            System.out.println("No user found");
            return;
        }

        Notification notification = Notification.builder()
                .user(user)
                .title("Test")
                .message("Test Message")
                .type(NotificationType.SYSTEM)
                .isRead(false)
                .relatedId(10L)
                .build();
        
        try {
            notificationRepository.save(notification);
            System.out.println("Notification saved successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
