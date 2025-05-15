def user_data(request):
    """
    Add user information to the template context
    """
    user_context = {
        'is_authenticated': request.user.is_authenticated,
    }
    
    if request.user.is_authenticated:
        user_context.update({
            'username': request.user.username,
            'is_company_admin': request.user.is_company_admin,
            'company_name': request.user.company_name if request.user.is_company_admin else '',
        })
        
    return user_context 