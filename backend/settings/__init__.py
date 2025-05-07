# Ce fichier vide permet à Python de traiter le dossier settings comme un package
# Par défaut, on utilise les paramètres de développement si aucune variable d'environnement n'est définie

import os

# Chargement des settings basé sur l'environnement
environment = os.environ.get('DJANGO_ENV', 'dev')

if environment == 'production':
    from .prod import *  # noqa
else:
    from .dev import *  # noqa