DevTinder APIs


-auth Router
POST /signup
POST /login
POST /logout


-profile Router
GET /profile/view
PATCH /profile/edit
PATCH /profile/password


-connectionRequest Router
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accept/:requestId
POST /request/review/reject/:requestId

-user Router
GET /user/requests/received
GET /user/connections
GET /user/feed -fetches profiles of other users of the platform

Status: Ignored,Interested,Accepted,Rejected
