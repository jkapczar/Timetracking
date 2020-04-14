package core.model;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity(name = "EventHistory")
@Table(name = "HISTORY")
public class EventHistory {
    @Id
    @Column(name = "ID")
    @SequenceGenerator(name="eventhistory_sequence",sequenceName = "eventhistory_sequence",allocationSize = 1,initialValue=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="eventhistory_sequence")
    private Long id;
    @Column(name = "groupName")
    private String groupName;
    @Column(name = "owner")
    private String eventOwner;
    @OneToMany(mappedBy = "history",cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Event> events = new HashSet<>();
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    public void addEvents(Set<Event> e){
        for (Event event: e) {
            event.setHistory(this);
            this.getEvents().add(event);
        }
    }

    public void removeEvents(Set<Event> e){
        for (Event event: e) {
            this.getEvents().remove(event);
            event.setHistory(null);
        }
    }

    public void addEvent(Event e){
        e.setHistory(this);
        this.getEvents().add(e);
    }

    public void removeEvent(Event e){
        this.getEvents().remove(e);
        e.setHistory(null);
    }

}
