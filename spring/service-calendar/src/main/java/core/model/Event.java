package core.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Entity(name = "Event")
@Table(name = "EVENTS")
public class Event {
    @Id
    @Column(name = "ID")
    @SequenceGenerator(name="event_sequence",sequenceName = "event_sequence",allocationSize = 1,initialValue=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="event_sequence")
    private Long id;
    @Column(name = "title")
    private String title;
    @Column(name = "groupId")
    private String groupId;
    @Column(name = "start")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime start;
    @Column(name = "end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime end;
    @Column(name = "bgcolor")
    private String backgroundColor;
    @Column(name = "textcolor")
    private String textColor;
    @Column(name = "allday")
    private Boolean allDay;
    @ManyToOne
    @JoinColumn(name = "USER_ID", foreignKey = @ForeignKey(name = "ID"))
    @JsonIgnore
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;
    @ManyToOne
    @JsonIgnore
    private EventHistory history;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Event)) return false;
        Event event = (Event) o;
        return groupId.equals(event.groupId) &&
                start.equals(event.start) &&
                Objects.equals(end, event.end) &&
                user.equals(event.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId, start, end, user);
    }
}
