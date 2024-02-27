# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import abc
class IdentityProviderAbstractClass (abc.ABC):
    
    @abc.abstractmethod
    def create_control_plane_idp(self,event):
        pass