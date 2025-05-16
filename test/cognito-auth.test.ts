/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { CognitoAuth } from '../src/control-plane';

describe('CognitoAuth', () => {
  describe('AdvancedSecurityMode', () => {
    it('should enable advanced security mode by default', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack');
      
      // WHEN
      new CognitoAuth(stack, 'CognitoAuth');
      
      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Cognito::UserPool', {
        UserPoolAddOns: {
          AdvancedSecurityMode: 'ENFORCED'
        }
      });
    });

    it('should enable advanced security mode when explicitly set to true', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack');
      
      // WHEN
      new CognitoAuth(stack, 'CognitoAuth', {
        enableAdvancedSecurityMode: true
      });
      
      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Cognito::UserPool', {
        UserPoolAddOns: {
          AdvancedSecurityMode: 'ENFORCED'
        }
      });
    });

    it('should not set advanced security mode when explicitly disabled', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack');
      
      // WHEN
      new CognitoAuth(stack, 'CognitoAuth', {
        enableAdvancedSecurityMode: false
      });
      
      // THEN
      const template = Template.fromStack(stack);
      
      // Advanced security mode should not be set when disabled
      template.hasResourceProperties('AWS::Cognito::UserPool', {
        UserPoolAddOns: Match.absent()
      });
    });

    it('should handle errors when setting advanced security mode', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack');
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create a mock implementation that throws an error
      const originalDefaultChild = Object.getOwnPropertyDescriptor(
        cdk.Resource.prototype.node, 
        'defaultChild'
      );
      
      // Mock the defaultChild to throw an error when accessed
      Object.defineProperty(cdk.Resource.prototype.node, 'defaultChild', {
        get: function() {
          throw new Error('Mock error accessing defaultChild');
        }
      });
      
      try {
        // WHEN
        new CognitoAuth(stack, 'CognitoAuth');
        
        // THEN
        // It should not throw but log a warning
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to enable advanced security mode:',
          expect.any(Error)
        );
      } finally {
        // Restore the original implementation
        if (originalDefaultChild) {
          Object.defineProperty(
            cdk.Resource.prototype.node,
            'defaultChild',
            originalDefaultChild
          );
        }
        consoleSpy.mockRestore();
      }
    });
  });
});
