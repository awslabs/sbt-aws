# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

from enum import Enum


class ControlPlaneEventTypes(Enum):
    ONBOARDING = 'Onboarding'
    OFFBOARDING = 'Offboarding'
    ACTIVATE = 'Activate'
    DEACTIVATE = 'Deactivate'

    def __str__(self):
        return str(self.value)
