# notifications/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q

from .models import Notification
from .serializers import NotificationSerializer
from accounts.permissions import IsOwnerOrReadOnly

class NotificationViewSet(viewsets.ModelViewSet):
    """Gestion des notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Ne récupérer que les notifications de l'utilisateur connecté"""
        return Notification.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Liste les notifications avec options de filtrage"""
        # Filtres possibles : lues/non lues, type, etc.
        is_read = request.query_params.get('is_read')
        notification_type = request.query_params.get('type')
        
        queryset = self.get_queryset()
        
        if is_read is not None:
            is_read = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read)
            
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marquer une notification comme lue"""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marquer toutes les notifications comme lues"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Compter les notifications non lues"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})
