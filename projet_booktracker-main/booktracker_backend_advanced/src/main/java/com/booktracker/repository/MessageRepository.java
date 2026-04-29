package com.booktracker.repository;

import com.booktracker.entity.Message;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
            User sender1, User receiver1, User sender2, User receiver2
    );

    List<Message> findByReceiverAndIsReadFalseOrderBySentAtDesc(User receiver);

    List<Message> findByReceiverAndSenderAndIsReadFalse(User receiver, User sender);
}