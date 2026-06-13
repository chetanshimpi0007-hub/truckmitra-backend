package com.truckmitra.repository.chat;

import com.truckmitra.entity.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT c FROM ChatMessage c WHERE (c.sender.id = :userId1 AND c.receiver.id = :userId2) OR (c.sender.id = :userId2 AND c.receiver.id = :userId1) ORDER BY c.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
