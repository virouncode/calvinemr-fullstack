# Active Context: Calvin EMR

## Current Work Focus

The current focus is on security and session management features, specifically:

1. **Auto-logout functionality** - Automatically logging out users after a period of inactivity
2. **Screen locking** - Temporarily locking the screen while maintaining the session
3. **Local storage tracking** - Monitoring and managing data stored in the browser's local storage

These features are critical for ensuring the application meets healthcare security requirements, particularly for protecting patient data when users step away from their workstations.

## Recent Changes

### Security Enhancements

- Implemented `useAutoLogout.ts` hook to handle automatic logout after inactivity
- Created `useAutoLockScreen.ts` hook to manage temporary screen locking
- Developed `useLocalStorageTracker.ts` hook to monitor and manage local storage data

### Code Organization

- Structured custom hooks in a dedicated `/hooks` directory
- Implemented consistent patterns for React hooks
- Ensured proper TypeScript typing across new components

## Next Steps

### Immediate Priorities

1. **Testing Security Features**

   - Verify auto-logout functionality works across different user roles
   - Test screen locking under various conditions
   - Ensure local storage tracking properly manages sensitive data

2. **Documentation**

   - Update technical documentation with security implementation details
   - Create user documentation for security features
   - Document configuration options for security timeouts

3. **Integration**
   - Integrate security features with the authentication system
   - Ensure consistent behavior across different parts of the application
   - Implement user preferences for security settings

### Upcoming Work

1. **Audit Logging**

   - Implement comprehensive audit logging for security events
   - Create admin interface for reviewing security logs

2. **Two-Factor Authentication**

   - Research and plan implementation of 2FA
   - Design user experience for 2FA enrollment and usage

3. **Enhanced Data Protection**
   - Review and improve encryption for sensitive data
   - Implement additional safeguards for PHI

## Active Decisions and Considerations

### Security Timeout Configuration

- Determining appropriate timeout periods for different user roles
- Balancing security requirements with user experience
- Considering regulatory requirements for healthcare applications

### Local Storage Strategy

- Deciding what data can be safely stored in local storage
- Implementing encryption for sensitive local data
- Planning for secure data cleanup on session end

### User Experience Considerations

- Designing clear notifications for impending session timeout
- Creating intuitive screen unlock experience
- Balancing security with usability

### Technical Implementation Choices

- Using React hooks for encapsulating security logic
- Leveraging TypeScript for type safety in security features
- Considering browser compatibility for storage and timeout APIs

## Current Questions and Challenges

1. **Timeout Customization**

   - How to allow administrators to configure timeout periods for different user roles?
   - What are the regulatory minimum requirements for healthcare applications?

2. **Mobile Considerations**

   - How should auto-logout and screen locking behave on mobile devices?
   - Are there different security considerations for mobile vs. desktop?

3. **Testing Methodology**
   - What is the best approach to test timeout functionality?
   - How to simulate different user inactivity scenarios?

This active context document reflects the current state of work on the Calvin EMR system as of the last update. It should be consulted when picking up work to ensure continuity and understanding of the current focus areas.
