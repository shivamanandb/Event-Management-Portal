package com.example.backend.services.Implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.services.OrganizerDetailsService;

@Service
public class OrganizerDetailsServiceImpl implements OrganizerDetailsService {

    @Autowired
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Override
    public void saveOrganizerDetails(User user) {
        
        try{
            
            OrganizerDetails organizerDetails = new OrganizerDetails();
            organizerDetails.setOrganizationName(user.getOrganizationName());
            organizerDetails.setDescription(user.getDescription());
            organizerDetails.setUser(user);
            System.out.println(organizerDetails.getUser());
            this.organizerDetailsRepository.save(organizerDetails);

        } catch(Exception e){
            System.out.println("Something went wrong");
            System.err.println(e);
        }
    }
    
}
