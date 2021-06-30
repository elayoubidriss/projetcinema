package org.sid.projetcinema.entities;

import org.springframework.data.rest.core.config.Projection;

@Projection(name="ticketProj",types= {org.sid.projetcinema.entities.Ticket.class})
public interface TicketProj {
	public Long getId();
	public String getNomClient();
	public double getPrix();
	public Integer getCodePayement();
	public boolean getReserve();
	public Place getPlace();

}
