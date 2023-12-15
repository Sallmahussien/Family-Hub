document.addEventListener('DOMContentLoaded', function() {
    var privacyView = document.querySelector('.privacy_view');
    var infoView = document.querySelector('.info_view');
    var membersView = document.querySelector('.members_view');

    var privacyOption = document.querySelector('.privacy');
    var infoOption = document.querySelector('.info');
    var membersOption = document.querySelector('.members');

    privacyView.style.display = 'none';
    infoView.style.display = 'none';
    membersView.style.display = 'none';

    privacyOption.addEventListener('click', function() {
        showView(privacyView);
    });

    infoOption.addEventListener('click', function() {
        showView(infoView);
    });

    membersOption.addEventListener('click', function() {
        showView(membersView);
    });

    function showView(viewToShow) {
        privacyView.style.display = (viewToShow === privacyView) ? 'flex' : 'none';
        infoView.style.display = (viewToShow === infoView) ? 'flex' : 'none';
        membersView.style.display = (viewToShow === membersView) ? 'flex' : 'none';
    }
});