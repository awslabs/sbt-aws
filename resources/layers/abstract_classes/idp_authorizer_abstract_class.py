# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import abc
class IdpAuthorizerAbstractClass (abc.ABC):
    
    @abc.abstractmethod
    def validateJWT(self,event):
        pass