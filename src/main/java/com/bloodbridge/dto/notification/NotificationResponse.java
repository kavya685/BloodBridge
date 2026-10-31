package com.bloodbridge.dto.notification;

import com.bloodbridge.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private NotificationType type;

    @JsonProperty("isRead")
    private boolean isRead;

    private LocalDateTime createdAt;

    @JsonProperty("isRead")
    public boolean isRead() {
        return isRead;
    }

    @JsonProperty("isRead")
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    @JsonProperty("read")
    public boolean getRead() {
        return isRead;
    }
}

