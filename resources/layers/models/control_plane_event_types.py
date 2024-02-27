# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""Module providingFunction printing python version."""
from enum import Enum


class ControlPlaneEventTypes(Enum):
    """Enum of possible event types that should be handled by the app plane"""
    ONBOARDING = 'Onboarding'
    OFFBOARDING = 'Offboarding'

    def __str__(self):
        return str(self.value)
